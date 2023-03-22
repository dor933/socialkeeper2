using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage;
using System.IO;
using Google.Cloud.Storage.V1;

namespace WebApplication1
{
    public class Googlecloudstorage
    {
        public StorageClient _storageClient;
        public string _bucketName;
        public string credentialfilepath;

        public Googlecloudstorage()
        {
            _bucketName = "responsive-cab-377615.appspot.com";
            string basedirector= AppDomain.CurrentDomain.BaseDirectory;
            credentialfilepath= Path.Combine(basedirector,"Googlecloud", "json.json");
            var credential = GoogleCredential.FromFile(credentialfilepath);
            _storageClient = StorageClient.Create(credential);

        }

    }

   
}