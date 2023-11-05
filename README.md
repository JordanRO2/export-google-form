# Google Forms JSON exporter

A small Google Apps Script to export a Google Form into a JSON file. This JSON object can be used to build tools to collect form responses through clients other than the Google Forms web interface.

### Installation

* Create a [Google Apps Script file](https://developers.google.com/apps-script/).
* Copy and paste the code from `src/Code.gs`.
* Replace the placeholder URL in the script with your form's editing URL.

You're all set to run the script!

### Example Output

The example output corresponds to [this form](https://docs.google.com/forms/d/e/1FAIpQLSc8mjo1vh9BrpLPVevXtb1G7WEXUiHnMIiSAENJyJKMB9ZsTA/viewform).

```json
{
  "metadata": {
    "title": "Survey on the Psychological Impact of Virtual Reality",
    "id": "1BAMuW1Hi1JuzFSx3KU-....-hpQqjtvLYxFgPk",
    "description": "Participate in our study on the psychological impact of virtual reality on young adults...",
    "publishedUrl": "https://docs.google.com/forms/d/e/1FAIpQLSc8mjo1vh9BrpLPVevXtb1G7WEXUiHnMIiSAENJyJKMB9ZsTA/viewform",
    "editorEmails": ["darkressxx1@gmail.com", "salmajportillo@gmail.com"],
    "itemCount": 55,
    "confirmationMessage": "Thank you for participating in our survey...",
    "customClosedFormMessage": ""
  },
  "items": [
    {
      "type": "SECTION_HEADER",
      "title": "Basic Information",
      "helpText": "This section gathers general information..."
    },
    // More items...
  ]
}
