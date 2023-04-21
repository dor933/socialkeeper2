using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class Utils
    {

        static public string cleanphonenumber(string phonenumber)
        {
            string cleanedPhoneNumberret = Regex.Replace(phonenumber, @"[^0-9]+", "");
            if (cleanedPhoneNumberret.StartsWith("972"))
            {
                cleanedPhoneNumberret = cleanedPhoneNumberret.Substring(3);
            }
            if (!cleanedPhoneNumberret.StartsWith("0"))
            {
                cleanedPhoneNumberret = "0" + cleanedPhoneNumberret;
            }

            return cleanedPhoneNumberret;
        }
    }
}