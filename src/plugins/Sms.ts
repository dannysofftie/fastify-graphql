import axios from 'axios';
import * as qs from 'querystring';
import { configs } from '../configs';

export interface IMessageArguments {
  to: string;
  message: string;
}

const generateToken = async () => {
  const res = await axios({
    method: 'POST',
    url: configs.endpoints.tokenUrl,
    data: { username: configs.africasTalkingUsername },
    headers: {
      apikey: configs.africasTalkingApiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return { token: res.data['token'], expires: res.data['lifetimeInSeconds'] * 1000 };
};

export const smsToPhoneNumber = async (args: IMessageArguments) => {
  const service = await generateToken();

  const data = qs.stringify({ username: configs.africasTalkingUsername, ...args });

  const response = await axios({
    method: 'POST',
    url: configs.endpoints.productionUrl,
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      apikey: configs.africasTalkingApiKey,
      'Content-Length': data.length,
    },
  }).then(res => res.data);

  if (response['SMSMessageData']?.['Message']?.includes('Sent to 0/')) {
    return { error: { message: 'Insufficient balance', field: 'SMS' } };
  }

  return { message: 'Sent successfully' };
};
