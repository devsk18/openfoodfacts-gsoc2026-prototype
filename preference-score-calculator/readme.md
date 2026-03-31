# OFF Preference Score Calculator

A web application that calculates preference scores for food products based on nutritional quality, processing level, and environmental impact. This prototype helps us understand how OFF Preference search works.

## Demo
<video src="../demos/videos/preference-score-demo.mp4" controls></video>

## Data Sources
The application uses the `attribute_groups` field from the Open Food Facts Product API to retrieve:
- Nutritional quality (Nutri-Score)
- Processing level (NOVA classification)
- Environmental impact (Eco-Score)
- Detailed nutritional information (salt, sugar, fat content)

## Running the Application

```
# Start the HTTP server to avoid cors issues
python -m http.server 5500
```


