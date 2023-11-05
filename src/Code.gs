// Original code by:
// Steven Schmatz
// Humanitas Labs
// 13 October, 2016.

// Updated by:
// Jordan Rivera,
// 05 November, 2023.

// URL for the Google Form; this URL must be authenticated for the current user.
var URL = "<your-form-editing-url-here>";

/**
 * Retrieves the metadata for a given Google Form.
 * @param {Form} form - The Google Form object.
 * @returns {Object} An object containing various metadata of the form.
 */
function getFormMetadata(form) {
  // Constructing and returning an object with form metadata.
  return {
    title: form.getTitle(),
    id: form.getId(),
    description: form.getDescription(),
    publishedUrl: form.getPublishedUrl(),
    editorEmails: form.getEditors().map(function(user) { return user.getEmail(); }),
    itemCount: form.getItems().length,
    confirmationMessage: form.getConfirmationMessage(),
    customClosedFormMessage: form.getCustomClosedFormMessage()
  };
}

/**
 * The main execution function that handles conversion of form data to JSON and saving it to Google Drive.
 */
function main() {
  // Open the form using the URL and extract items.
  var form = FormApp.openByUrl(URL);
  var items = form.getItems();

  // Construct result object with form metadata and items.
  var result = {
    metadata: getFormMetadata(form),
    items: items.map(itemToObject),
    count: items.length
  };

  // Convert result object to JSON string.
  var jsonString = JSON.stringify(result);

  // Save the JSON string as a file in Google Drive.
  var fileName = "form_data.json";
  var mimeType = MimeType.PLAIN_TEXT;
  var file = DriveApp.createFile(fileName, jsonString, mimeType);
  
  // Generate a URL for direct download of the file.
  var downloadUrl = "https://drive.google.com/uc?export=download&id=" + file.getId();
  
  // Log file creation and download details.
  Logger.log("File created with ID: " + file.getId());
  Logger.log("Download URL: " + downloadUrl);
}

/**
 * Converts a string from SNAKE_CASE format to camelCase format.
 * @param {string} s - The string in SNAKE_CASE format.
 * @returns {string} The string transformed into camelCase format.
 */
function snakeCaseToCamelCase(s) {
  // Replace occurrences of underscore and a character with the uppercase version of the character.
  return s.toLowerCase().replace(/(_\w)/g, function(m) {
    return m[1].toUpperCase();
  });
}

/**
 * Creates an object representation of a Form item.
 * @param {Item} item - The Form item.
 * @returns {Object} An object representing the form item.
 */
function itemToObject(item) {
  var data = {
    type: item.getType().toString(),
    title: item.getTitle()
  };

  // Extract common properties for all items if available.
  if (item.getHelpText) {
    data.helpText = item.getHelpText();
  }

  // Dynamically retrieve additional properties based on the item type.
  if (typeof item.asItem !== "undefined") {
    try {
      // Convert the item type to method name for type-specific properties.
      var itemType = snakeCaseToCamelCase('as_' + data.type + '_item');
      if (item[itemType]) {
        var typedItem = item[itemType]();
        
        // Get all 'get' methods from the item type prototype.
        var getKeysRaw = Object.getOwnPropertyNames(Object.getPrototypeOf(typedItem))
          .filter(function (property) {
            return typeof typedItem[property] === 'function' && property.startsWith("get");
          });

        // Convert 'get' methods to property names and extract their values.
        getKeysRaw.forEach(function (getKey) {
          var propName = getKey.slice(3);
          propName = propName.charAt(0).toLowerCase() + propName.slice(1);
          if (!["FeedbackForIncorrect", "FeedbackForCorrect", "GeneralFeedback"].includes(propName)) {
            var propValue = typedItem[getKey]();
            
            // Handle conversion for special object types like Blobs or Enums.
            if (propValue && typeof propValue === 'object') {
              if (propValue.constructor.name === 'Blob') {
                // TODO: Implement Blob conversion to a data URL or similar.
              } else if (Array.isArray(propValue)) {
                propValue = propValue.map(choice => choice.getValue ? choice.getValue() : choice);
              } else {
                propValue = propValue.toString();
              }
            }
            data[propName] = propValue;
          }
        });
      }
    } catch (e) {
      // Log any errors encountered during property extraction.
      Logger.log('Error processing item type: ' + e.toString());
    }
  }

  return data;
}
