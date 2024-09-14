import React from 'react';
import { address } from '../Register/CheckEmail';

const WithDrawal = async () => {
  const jwtToken = localStorage.getItem('jwtToken');
  try{
    const response = await address.delete('/api/member/leave', {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });
    console.log('회원탈퇴 성공!');
      
    return response.data;
  } catch (error) {
    console.error('Error axios data', error);
    throw error;
  }
};

export default WithDrawal;