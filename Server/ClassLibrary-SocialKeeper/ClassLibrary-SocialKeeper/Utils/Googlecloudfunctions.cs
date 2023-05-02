using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Storage.v1.Data;
using Google.Cloud.Storage.V1;
using Grpc.Core;

namespace ClassLibrary_SocialKeeper
{
    public class Googlecloudfunctions
    {

     

        static public async Task<string> UploadJsonToGoogleCloudStorage(string jsonContent, string remoteFilePath, Googlecloudservices _googleservices)
        {
            byte[] fileContents = Encoding.UTF8.GetBytes(jsonContent);
            string contentType = "application/json";

            MemoryStream fileStream = new MemoryStream(fileContents);
            var uploadedObject = await _googleservices._storageClient.UploadObjectAsync(_googleservices._bucketName, remoteFilePath, contentType, fileStream, new UploadObjectOptions());

            fileStream.Dispose();

            var acl = uploadedObject.Acl ?? new List<ObjectAccessControl>();
            acl.Add(new ObjectAccessControl
            {
                Entity = "allUsers",
                Role = "READER"
            });

            uploadedObject.Acl = acl;
            var updatedObject = await _googleservices._storageClient.UpdateObjectAsync(uploadedObject);

            var publicUrl = $"https://storage.googleapis.com/{_googleservices._bucketName}/{remoteFilePath}";
            return publicUrl;
        }

        static public async Task<string> Getfilefromcloudstorage(string remoteFilePath, Googlecloudservices _googleservices)
        {
            try
            {
                StorageClient storageClient = _googleservices._storageClient;
                string bucketName = _googleservices._bucketName;

                //download the file and return it
                var stream = new MemoryStream();
                await storageClient.DownloadObjectAsync(bucketName, remoteFilePath, stream);
                stream.Position = 0;
                StreamReader reader = new StreamReader(stream);
                string text = reader.ReadToEnd();
                return text;
             
            }
            catch (Google.GoogleApiException ex)
            {

                return null;
                

                // Handle other exceptions as needed
               
            }
        }

        public static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double EarthRadiusInKm = 6371;

            double lat1InRadians = ToRadians(lat1);
            double lat2InRadians = ToRadians(lat2);
            double deltaLatInRadians = ToRadians(lat2 - lat1);
            double deltaLonInRadians = ToRadians(lon2 - lon1);

            double a = Math.Sin(deltaLatInRadians / 2) * Math.Sin(deltaLatInRadians / 2) +
                       Math.Cos(lat1InRadians) * Math.Cos(lat2InRadians) *
                       Math.Sin(deltaLonInRadians / 2) * Math.Sin(deltaLonInRadians / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return EarthRadiusInKm * c;
        }

        public static double ToRadians(double degrees)
        {
            return degrees * (Math.PI / 180);
        }
    }
}