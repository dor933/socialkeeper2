using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage;
using System.IO;
using Google.Cloud.Storage.V1;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using Grpc.Auth;
using System.Reflection;
using System.Configuration.Assemblies;
using ClassLibrary_SocialKeeper;

namespace WebApplication1
{
    public class Creategooglecloudservice
    {
  

        static public Googlecloudservices Googlecloudservices()
        {
            
            Googlecloudservices googlecloudservices= new Googlecloudservices();
            googlecloudservices._bucketName = "responsive-cab-377615.appspot.com";
           
                //create the path to the json file
                string currentdirectory =  AppDomain.CurrentDomain.BaseDirectory;
             googlecloudservices.credentialfilepath= Path.Combine(currentdirectory, "GoogleCloudnew", "json1.json");
                string projectId = "responsive-cab-377615"; // Replace with your Firestore project ID
                var credential = GoogleCredential.FromFile(googlecloudservices.credentialfilepath);
                googlecloudservices._storageClient = StorageClient.Create(credential);

                googlecloudservices._clientfire = new FirestoreClientBuilder
                {
                    ChannelCredentials = credential.ToChannelCredentials()
                }.Build();
                googlecloudservices._firestoreDb = FirestoreDb.Create(projectId, googlecloudservices._clientfire);
                googlecloudservices.googlemapscred = "AIzaSyDCCbpFYxI2jGqyWacOIokLnXONGUCUmow";

            return googlecloudservices;
            

           

        }


    }
}