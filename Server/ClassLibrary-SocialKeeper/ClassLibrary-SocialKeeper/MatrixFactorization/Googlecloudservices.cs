using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage;
using System.IO;
using Google.Cloud.Storage.V1;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using Grpc.Auth;
using System.Reflection;

namespace ClassLibrary_SocialKeeper
{
    public class Googlecloudservices
    {
        public StorageClient _storageClient;
        public string _bucketName;
        public FirestoreDb _firestoreDb;
        public FirestoreClient _clientfire;
        public string credentialfilepath;
        public string googlemapscred;
    }
}
