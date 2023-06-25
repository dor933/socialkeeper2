using Newtonsoft.Json;
using System.Collections.Generic;
using ClassLibrary_SocialKeeper;


namespace ClassLibrary_SocialKeeper
{

   

    public class GooglePlacesApiResponse
    {
        [JsonProperty("results")]
        public List<PlaceResult> Results { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
    }

    public class SinglePlaceroot
    {
        
        [JsonProperty("result")]
        public PlaceResult Result { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
    }

    public class PlaceResult
    {
        [JsonProperty("business_status")]
        public string BusinessStatus { get; set; }

        [JsonProperty("geometry")]
        public Geometry Geometry { get; set; }

        [JsonProperty("editorial_summary")]
        public PlaceEditorialSummary PlaceEditorialSummary { get; set; }

        [JsonProperty("icon")]
        public string Icon { get; set; }

        [JsonProperty("icon_background_color")]
        public string IconBackgroundColor { get; set; }

        [JsonProperty("icon_mask_base_uri")]
        public string IconMaskBaseUri { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("opening_hours")]
        public OpeningHoursDetails OpeningHours { get; set; }

        [JsonProperty("photos")]
        public List<Photo> Photos { get; set; }

        [JsonProperty("place_id")]
        public string PlaceId { get; set; }

        [JsonProperty("plus_code")]
        public PlusCode PlusCode { get; set; }

        [JsonProperty("price_level")]
        public int? PriceLevel { get; set; }

        [JsonProperty("rating")]
        public double Rating { get; set; }

        [JsonProperty("reference")]
        public string Reference { get; set; }

        [JsonProperty("scope")]
        public string Scope { get; set; }

        [JsonProperty("types")]
        public List<string> Types { get; set; }

        [JsonProperty("user_ratings_total")]
        public int UserRatingsTotal { get; set; }

        [JsonProperty("formatted_phone_number")]
        public string FormattedPhoneNumber { get; set; }

        [JsonProperty("vicinity")]
        public string Vicinity { get; set; }

        public double bayesianrank { get; set; }
    }

    public class PlaceEditorialSummary
    {
        [JsonProperty("language")]
        public string language { get; set; }

        [JsonProperty("overview")]
        public string overview;
    }

    public class Geometry
    {
        [JsonProperty("location")]
        public Location Location { get; set; }

        [JsonProperty("viewport")]
        public Viewport Viewport { get; set; }
    }

    public class Location
    {
        [JsonProperty("lat")]
        public double Latitude { get; set; }

        [JsonProperty("lng")]
        public double Longitude { get; set; }
    }

    public class Viewport
    {
        [JsonProperty("northeast")]
        public Location Northeast { get; set; }

        [JsonProperty("southwest")]
        public Location Southwest { get; set; }
    }

    public class OpeningHoursDetails
    {
        [JsonProperty("open_now")]
        public bool OpenNow { get; set; }

        [JsonProperty("periods")]
        public List<Period> Periods { get; set; }

        [JsonProperty("weekday_text")]
        public List<string> WeekdayText { get; set; }
    }

    public class Period
    {
        [JsonProperty("close")]
        public TimeInfo Close { get; set; }

        [JsonProperty("open")]
        public TimeInfo Open { get; set; }
    }

    public class TimeInfo
    {
        [JsonProperty("day")]
        public int Day { get; set; }

        [JsonProperty("time")]
        public string Time { get; set; }
    }

  

    public class Photo
    {
        [JsonProperty("height")]
        public int Height { get; set; }

        [JsonProperty("html_attributions")]
        public List<string> HtmlAttributions { get; set; }

        [JsonProperty("photo_reference")]
        public string PhotoReference { get; set; }

        [JsonProperty("width")]
        public int Width { get; set; }
    }

    public class PlusCode
    {
        [JsonProperty("compound_code")]
        public string CompoundCode { get; set; }

        [JsonProperty("global_code")]
        public string GlobalCode { get; set; }
    }

    static public class Extractingfromjson
    {
        static public List<PlaceResult> ExtractPlacesFromJson(string jsonResponse)
        {
            // Deserialize the JSON string to a GooglePlacesApiResponse object
            GooglePlacesApiResponse placesResponse = JsonConvert.DeserializeObject<GooglePlacesApiResponse>(jsonResponse);

            // Create a list to store the extracted places
            List<PlaceResult> places = new List<PlaceResult>();

            // Process each place result
            foreach (PlaceResult placeResult in placesResponse.Results)
            {
                // Create a new Place object and set its properties based on the placeResult
                PlaceResult place = new PlaceResult
                {
                    Name = placeResult.Name,
                    PlaceId = placeResult.PlaceId,
                    Geometry = placeResult.Geometry
                   
                
                    // Add other properties as needed
                };

                // Process photos
              

                // Add the place to the list of places
                places.Add(place);
            }

            return places;
        }

        static public OpeningHoursDetails ExtractOpeningHoursDetailsFromJson(string jsonResponse)
        {
            string cleanedJsonResponse = jsonResponse.Replace("\n", "");
            // Deserialize the JSON string to an OpeningHoursDetailsResponse object
            OpeningHoursDetailsResponse openingHoursDetailsResponse = JsonConvert.DeserializeObject<OpeningHoursDetailsResponse>(cleanedJsonResponse);

            // Return the opening hours details object
            return openingHoursDetailsResponse.Result.OpeningHoursDetails;
        }
    }
}