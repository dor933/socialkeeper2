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

namespace WebApplication1
{
    public class Googlecloudservices
    {
        public StorageClient _storageClient;
        public string _bucketName;
        public FirestoreDb _firestoreDb;
        public FirestoreClient _clientfire;
        public string credentialfilepath;

        public Googlecloudservices()
        {
            _bucketName = "responsive-cab-377615.appspot.com";
            string basedirector= AppDomain.CurrentDomain.BaseDirectory;
            string projectId = "responsive-cab-377615"; // Replace with your Firestore project ID
            credentialfilepath = Path.Combine(basedirector,"Googlecloud", "json.json");
            var credential = GoogleCredential.FromFile(credentialfilepath);
            _storageClient = StorageClient.Create(credential);

            _clientfire= new FirestoreClientBuilder
            {
                ChannelCredentials = credential.ToChannelCredentials()
            }.Build();
            _firestoreDb = FirestoreDb.Create(projectId,_clientfire);

        }

    }

   
}