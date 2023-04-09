import './Home.css';
import fetchConfiguration from '../../hooks/fetchConfiguration';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Wrapper from '../../components/wrapper'
import React, { useEffect, useState } from 'react';
import Loading from '../../components/loading/loading';
import store from '../../stores/store';


function Home() {

  let configuration = store.configuration;

  fetchConfiguration();

  let currentScreen = <div className="loading-fullcontainer">
    <Loading />
    <h1>Loading Configuration</h1>
  </div>


  if (configuration.views)
    currentScreen =
      <div className="Home">
        <Header />
        <Wrapper />
        <Footer />
      </div>


  return currentScreen;

}

export default Home;
