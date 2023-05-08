import * as Linking from 'expo-linking';
import call from 'react-native-phone-call'


async function whatsappcontact(phonenumber){

    let url = `whatsapp://send?text=You have been invited to be my friend on Social Keeper&phone=972${phonenumber}`;

    Linking.openURL(url).then((data) => {
    }).catch(() => {
      alert('Make sure WhatsApp installed on your device');
    });
  }

  async function telegramcontact(phonenumber){

    let url = `tg://msg?text=You have been invited to be my friend on Social Keeper&phone=972${phonenumber}`;


    Linking.openURL(url).then((data) => {
    }).catch(() => {
      alert('Make sure Telegram installed on your device');
    });
  }

  async function mailcomposer(email){

  
    let url = `mailto:${email}?subject=You have been invited to be my friend on Social Keeper&body=You have been invited to be my friend on Social Keeper`;
    //send the email
    Linking.openURL(url).then((data) => {
    }).catch(() => {
      alert('Make sure Mail installed on your device');
    });

  }

  async function callnumber(phonenumber){
 
    const args = {
      number: phonenumber,
      prompt: true,
    }
    call(args).catch(console.error)
  }


    export {whatsappcontact,telegramcontact,mailcomposer,callnumber};


  
