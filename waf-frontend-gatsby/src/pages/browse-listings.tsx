import React, { useState, Dispatch, SetStateAction } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';
import SEO from '../components/seo';
import MessageThreadSection from '../components/message-thread-section';
import ListingItem from '../components/listing-item';
import { IListingsState } from '../state/reducers/listings';
import { connect } from 'react-redux';
import { IState } from '../state/createStore';
import { useDispatch } from 'react-redux';
import { setManuallyEnteringZipcode, submitManuallyEnteredZipcode, submitUpdatedLocation } from '../state/actions/global-application-properties'

const someMessageRooms = [{
  createdBy: "Jim",
  headline: "play guitar"
},
{
  createdBy: "Bobby",
  headline: "go to a dubstep show"
}
]


const BrowsePage = (props: any) => {

  const dispatch = useDispatch()

  type Custom = [string, Dispatch<SetStateAction<string>>]

  // interface Custom2 {
  //   manuallyEnteredZipcodeInputValue: string | number,
  //   setEnteringZipcodeInputValue: any
  // }

  const [manuallyEnteredZipcodeInputValue, setEnteringZipcodeInputValue]: Custom = useState('');

  const toggleManuallyEnteringZipcodeuser = (newState: boolean) => {
    console.log('dispatching open manual zipcode entry')
    dispatch(setManuallyEnteringZipcode(newState))
    if (!newState)
      setEnteringZipcodeInputValue('')
  }

  const submitManuallyEnteredZipcodeClicked = () => {
    console.log('dispatching open manual zipcode entry')
    console.log('submitting new zipcode: ', manuallyEnteredZipcodeInputValue)
    dispatch(submitManuallyEnteredZipcode(manuallyEnteredZipcodeInputValue))
    toggleManuallyEnteringZipcodeuser(false)
  }

  const enteringZipcodeInputChange = (event: any) => {
    // this.setState({value: event.target.value});
    setEnteringZipcodeInputValue(event?.target?.value)
  }
  const useCurrentLocationClicked = () => {
    // this.setState({value: event.target.value});
    // setEnteringZipcodeInputValue(event?.target?.value)
    const geo = navigator.geolocation;
    if (!geo) {
      // setError('Geolocation is not supported');

      console.log('Geolocation is not supported?')
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      dispatch(submitUpdatedLocation({
        type: 'Point',
        coordinates: [position.coords.latitude, position.coords.longitude]
      }))

      console.log('yerrp', longitude)
      console.log('yerrp', latitude)
      console.log('yerrp', position)
      // status.textContent = '';
      // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    }, (error) => {
      console.log('errr getting location! ', error)
    })

    console.log('use current location clicked ', geo)
}


const countrySelected = (event: any) => {
  console.log('countrySelected, ', event)
}



return (<>
  <Layout>
    <SEO title='Browse Listings' />
    <h1>Listings Near You</h1>

    {/* <h3>{`editing zip: ${props.manuallyEditingLocation}`}</h3> */}

    {/* === Zipcode Not Yet Set === */}
    {props.currentZipcode || props.currentZipcode === 0 &&
      <>
        <p>
          It looks like there's no location set. We need to know what area we should show you listings near! 😊
          </p>
      </>
    }

    {/* === Zipcode Has Been Set === */}
    {props?.currentZipcode !== 0 &&
      <>
        <h3>
          Showing listings within 25 miles of {props.currentZipcode}.
          </h3>


        <h3> Listings from redux:</h3>
        <ListingItem creator={"You"} messagesRoomsList={props.listings} />


      </>
    }

    {
      props.manuallyEditingLocation === false &&
      <>
        <button onClick={(e) => toggleManuallyEnteringZipcodeuser(true)}>Enter Zipcode</button>

        &nbsp;&nbsp;&nbsp;
          <button onClick={(e) => useCurrentLocationClicked()}>Use Current Location</button>
     
        <br/>
        <br/>
        </>
    }
    {
      props.manuallyEditingLocation === true &&
      <>

        <br />
        <h2>Change Location</h2>


        <label>Zipcode: </label>
        <input type="text" value={manuallyEnteredZipcodeInputValue} onChange={(e) => enteringZipcodeInputChange(e)} />
        <br />
        <br />

        <label>Country: </label>
        <select value={manuallyEnteredZipcodeInputValue} onChange={(e) => countrySelected(e)}>
          <option value="United States">United States</option>
        </select>
        <br />
        <br />

        <button onClick={(e) => submitManuallyEnteredZipcodeClicked()}>Save</button>
        &nbsp;&nbsp;&nbsp;
          <button onClick={(e) => toggleManuallyEnteringZipcodeuser(false)}>Cancel</button>
        <br />
        <br />
        {/* 
              <button>Use Current Location</button>
              <button>Set Zip</button> */}
      </>
    }


    {/* <ListingItem creator={"You"} messagesRoomsList={someMessageRooms} /> */}

    {/* <h1>Message Threads From Your Listings</h1>
    <MessageThreadSection header={"Play Guitar"} creator={"You"} messagesRoomsList={someMessageRooms} />
    <MessageThreadSection header={"Code In Clojure"} creator={"You"} messagesRoomsList={someMessageRooms} />
    <MessageThreadSection header={"Play Tennis"} creator={"You"} messagesRoomsList={someMessageRooms} />

    <h1>Message Threads From Other Users' Listings</h1> */}
    {/* <MessageThreadSection header={"Play Guitar"} creator={"Someone else"} messagesRoomsList={someMessageRooms} />
    <MessageThreadSection header={"Code In Clojure"} creator={"Someone else"} messagesRoomsList={someMessageRooms} />
    <MessageThreadSection header={"Play Tennis"} creator={"Someone else"} messagesRoomsList={someMessageRooms} /> */}

    {/* <p>Welcome to page 2</p> */}
    {/* <Link to='/'>Go back to the homepage</Link> */}

  </Layout>
</>)

}

const mapStateToProps = (state: IState) => {
  return {
    listings: state.listingsReducer?.listings,
    currentZipcode: state.globalAppPropertiesReducer?.currentZipcode,
    currentGeolocation: state.globalAppPropertiesReducer?.currentGeolocation,
    manuallyEditingLocation: state.globalAppPropertiesReducer?.manuallyEditingLocation
  };
};

export default connect(mapStateToProps)(BrowsePage);
