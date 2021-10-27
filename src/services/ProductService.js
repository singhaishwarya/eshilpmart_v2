import axios from 'axios';
import { Component } from "react";
import { baseUrl, config } from './index.js';

export default class ProductService extends Component {
  static fetchAllProducts = async (data) => {
    try {
      config.url = baseUrl + 'products';
      config.method = 'get';
      config.params = data;
      config.data = '';
      const response = await axios(config);
      return response.data ? response.data.data : [];
    } catch (error) {
      const { response } = error;
      if (!response) return;
      console.log(`FETCH GET ERROR`, response);

    }
  }
  static fetchReviews = async (data) => {
    try {
      config.url = baseUrl + 'product-reviews';
      config.method = 'get';
      config.params = data;
      config.data = '';
      const response = await axios(config);
      return response.data ? response.data : [];
    } catch (error) {
      const { response } = error;
      if (!response) return;
      console.log(`FETCH GET ERROR`, response);

    }
  }
  static fetchVendor = async (data) => {
    try {
      config.url = baseUrl + 'vendor';
      config.method = 'get';
      config.params = data;
      config.data = '';
      const response = await axios(config);
      return response.data ? response.data.data : [];
    } catch (error) {
      const { response } = error;
      if (!response) return;
      console.log(`FETCH GET ERROR`, response);

    }
  }

  static isLikeReview = async (data) => {
    try {
      config.url = baseUrl + 'is-like-review';
      config.method = 'post';
      config.params = data;
      config.data = '';
      const response = await axios(config);
      return response.data ? response.data : [];
    } catch (error) {
      const { response } = error;
      if (!response) return;
      console.log(`FETCH GET ERROR`, response);

    }
  }
}