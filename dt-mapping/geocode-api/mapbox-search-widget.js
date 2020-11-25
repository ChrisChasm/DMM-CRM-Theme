/** Mapbox search box widget */
jQuery(document).ready(function(){

  // load widget
  if ( dtMapbox.post.length !== 0 ) {
    write_results_box()
  }
  jQuery( '#new-mapbox-search' ).on( "click", function() {
    write_input_widget()
  });
})

// write location list from post contents
function write_results_box() {
  jQuery('#mapbox-wrapper').empty().append(`<div id="location-grid-meta-results"></div>`)

  if ( ( dtMapbox.post.location_grid_meta !== undefined && dtMapbox.post.location_grid_meta.length !== 0 ) || ( dtMapbox.post.contact_address !== undefined && dtMapbox.post.contact_address.length !== 0 ) ) {

    let lgm_results = jQuery('#location-grid-meta-results')

    if ( dtMapbox.post.location_grid_meta !== undefined && dtMapbox.post.location_grid_meta.length !== 0 ) {
      jQuery.each( dtMapbox.post.location_grid_meta, function(i,v) {
        lgm_results.append(`<div class="input-group">
                              <input type="text" class="active-location input-group-field " id="location-${_.escape( v.grid_meta_id )}" value="${_.escape( v.label )}" readonly />
                              <div class="input-group-button">
                                <button type="button" class="button alert clear-date-button delete-button mapbox-delete-button" title="Delete Location" data-id="${_.escape( v.grid_meta_id )}">&times;</button>
                              </div>
                            </div>`)
      })
    }

    if ( dtMapbox.post.contact_address !== undefined && dtMapbox.post.contact_address.length !== 0 ) {
      jQuery.each( dtMapbox.post.contact_address, function(i,v) {
        lgm_results.append(`<div class="input-group">
                              <input type="text" class="dt-communication-channel" id="${_.escape( v.key )}" value="${_.escape( v.value )}" data-field="contact_address" />
                              <button type="button" class="button alert input-height clear-date-button channel-delete-button delete-button" title="No location data. Note only." data-field="contact_address" data-key="${_.escape( v.key )}">&times;</button>
                            </div>`)
      })
    }

    delete_click_listener()
    reset_tile_spacing()
  } /*end valid check*/
}

// adds listener for delete buttons
function delete_click_listener() {
  jQuery( '.mapbox-delete-button' ).on( "click", function(e) {

    let data = {
      location_grid_meta: {
        values: [
          {
            grid_meta_id: jQuery(this).data("id"),
            delete: true,
          }
        ]
      }
    }

    API.update_post( dtMapbox.post_type, dtMapbox.post_id, data ).then(function (response) {
      console.log( response )
      dtMapbox.post = response
      write_results_box()
    }).catch(err => { console.error(err) })

  });
}

// resets the tiles for new spacing
function reset_tile_spacing() {
  let masonGrid = jQuery('.grid')
  masonGrid.masonry({
    itemSelector: '.grid-item',
    percentPosition: true
  });
}

// writes the geocoding field at the top of the mapping area for adding a new location
function write_input_widget() {

  if ( jQuery('#mapbox-autocomplete').length === 0 ) {
    jQuery('#mapbox-wrapper').prepend(`
    <div id="mapbox-autocomplete" class="mapbox-autocomplete input-group" data-autosubmit="true">
        <input id="mapbox-search" type="text" name="mapbox_search" placeholder="Search Location" />
        <div class="input-group-button">
            <button class="button hollow" id="mapbox-spinner-button" style="display:none;"><img src="${_.escape( dtMapbox.spinner_url )}" alt="spinner" style="width: 18px;" /></button>
        </div>
        <div id="mapbox-autocomplete-list" class="mapbox-autocomplete-items"></div>
    </div>
  `)
  }

  window.currentfocus = -1

  jQuery('#mapbox-search').on("keyup", function(e){

    var x = document.getElementById("mapbox-autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.which === 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      console.log('down')
      window.currentfocus++;
      /*and and make the current item more visible:*/
      add_active(x);
    } else if (e.which === 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      console.log('up')
      window.currentfocus--;
      /*and and make the current item more visible:*/
      add_active(x);
    } else if (e.which === 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (window.currentfocus > -1) {
        /*and simulate a click on the "active" item:*/
        close_all_lists(window.currentfocus);
      }
    } else {
      validate_timer()
    }

  })

  reset_tile_spacing()
}
function add_active(x) {
  /*a function to classify an item as "active":*/
  if (!x) return false;
  /*start by removing the "active" class on all items:*/
  remove_active(x);
  if (window.currentfocus >= x.length) window.currentfocus = 0;
  if (window.currentfocus < 0) window.currentfocus = (x.length - 1);
  /*add class "autocomplete-active":*/
  x[window.currentfocus].classList.add("mapbox-autocomplete-active");
}
function remove_active(x) {
  /*a function to remove the "active" class from all autocomplete items:*/
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("mapbox-autocomplete-active");
  }
}

// delay location lookup (this saves unnecessary geocoding requests and keeps DT usage in the free tier of Mapbox
// essentially the timer is reset each time a new character is added, and waits 1 second after key strokes stop
window.validate_timer_id = '';
function validate_timer() {

  clear_timer()

  // toggle buttons
  jQuery('#mapbox-spinner-button').show()

  // set timer
  window.validate_timer_id = setTimeout(function(){

    // call geocoder
    if ( dtMapbox.google_map_key ) {
      google_autocomplete( jQuery('#mapbox-search').val() )
    } else {
      mapbox_autocomplete( jQuery('#mapbox-search').val() )
    }

    // toggle buttons back
    jQuery('#mapbox-spinner-button').hide()
  }, 1000);

}
function clear_timer() {
  clearTimeout(window.validate_timer_id);
}
// end delay location lookup

// main processor and router for selection of autocomplete results
function close_all_lists(selection_id) {

  /* if Geocoding overridden, and plain text address selected */
  if( 'address' === selection_id ) {
    jQuery('#mapbox-autocomplete-list').empty()
    let address = jQuery('#mapbox-search').val()
    let update = { value: address }
    post_contact_address( update )
  }

  /* if Google Geocoding enabled*/
  else if ( dtMapbox.google_map_key ) {
    jQuery('#mapbox-search').val(window.mapbox_result_features[selection_id].description)
    jQuery('#mapbox-autocomplete-list').empty()

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId: window.mapbox_result_features[selection_id].place_id }, (results, status) => {
      if (status !== "OK") {
        console.log("Geocoder failed due to: " + status);
        return;
      }

      window.location_data = {
        location_grid_meta: {
          values: [
            {
              lng: results[0].geometry.location.lng(),
              lat: results[0].geometry.location.lat(),
              level: convert_level( results[0].types[0] ),
              label: results[0].formatted_address,
              source: 'user'
            }
          ]
        }
      }
      post_geocoded_location()
    });

    /* if Mapbox enabled */
  } else {
    jQuery('#mapbox-search').val(window.mapbox_result_features[selection_id].place_name)
    jQuery('#mapbox-autocomplete-list').empty()

    window.location_data = {
      location_grid_meta: {
        values: [
          {
            lng: window.mapbox_result_features[selection_id].center[0],
            lat: window.mapbox_result_features[selection_id].center[1],
            level: window.mapbox_result_features[selection_id].place_type[0],
            label: window.mapbox_result_features[selection_id].place_name,
            source: 'user'
          }
        ]
      }
    }
    post_geocoded_location()
  }
}

// builds the mapbox autocomplete list for selection
function mapbox_autocomplete(address){
  console.log('mapbox_autocomplete: ' + address )
  if ( address.length < 1 ) {
    return;
  }

  let root = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
  let settings = '.json?types=country,region,postcode,district,place,locality,neighborhood,address&limit=6&access_token='
  let key = dtMapbox.map_key
  let url = root + encodeURI( address ) + settings + key

  jQuery.get( url, function( data ) {
    console.log(data)
    if( data.features.length < 1 ) {
      // destroy lists
      console.log('no results')
      return
    }

    let list = jQuery('#mapbox-autocomplete-list')
    list.empty()

    jQuery.each( data.features, function( index, value ) {

      list.append(`<div data-value="${_.escape( index )}">${_.escape( value.place_name )}</div>`)
    })

    list.append(`<div data-value="address">${_.escape( window.dtMapbox.translations.stay_with )}: "${_.escape( address )}"</div>`)

    jQuery('#mapbox-autocomplete-list div').on("click", function (e) {
      close_all_lists(e.target.attributes['data-value'].value);
    });

    // Set globals
    window.mapbox_result_features = data.features


  }); // end get request
} // end validate

// builds the autocomplete list from Google (if Google key is installed)
function google_autocomplete(address){
  console.log('google_autocomplete: ' + address )
  if ( address.length < 1 ) {
    return;
  }

  let service = new google.maps.places.AutocompleteService();
  service.getPlacePredictions({ 'input': address }, function(predictions, status ) {
    if (status === 'OK') {
          console.log(predictions)
          let list = jQuery('#mapbox-autocomplete-list')
          list.empty()

          jQuery.each( predictions, function( index, value ) {
            list.append(`<div data-value="${index}">${_.escape( value.description )}</div>`)
          })

          jQuery('#mapbox-autocomplete-list div').on("click", function (e) {
            close_all_lists(e.target.attributes['data-value'].value);
          });

          // Set globals
          window.mapbox_result_features = predictions

        } else {
          console.log('Predictions was not successful for the following reason: ' + status)
        }
  } )

}

// submits geocoded results and resets list
function post_geocoded_location() {
  if ( jQuery('#mapbox-autocomplete').data('autosubmit') ) {
    /* if post_type = user, else all other post types */
    API.update_post( dtMapbox.post_type, dtMapbox.post_id, window.location_data ).then(function (response) {
      console.log( response )

      dtMapbox.post = response
      jQuery('#mapbox-wrapper').empty()
      write_results_box()

    }).catch(err => { console.error(err) })

  } else {
    window.selected_location_grid_meta = window.location_data
    jQuery('#mapbox-spinner-button').hide()
  }
}

// submits address override and resets list
function post_contact_address( update ) {
  API.update_post(window.dtMapbox.post_type, window.dtMapbox.post_id, { ["contact_address"]: [update]}).then((updatedContact)=>{
    dtMapbox.post = updatedContact
    jQuery('#mapbox-wrapper').empty()
    write_results_box()
  }).catch(handleAjaxError)
}

// converts the long admin level response to a location grid version
function convert_level( level ) {
  switch(level){
    case 'administrative_area_level_0':
      level = 'admin0'
      break
    case 'administrative_area_level_1':
      level = 'admin1'
      break
    case 'administrative_area_level_2':
      level = 'admin2'
      break
    case 'administrative_area_level_3':
      level = 'admin3'
      break
    case 'administrative_area_level_4':
      level = 'admin4'
      break
    case 'administrative_area_level_5':
      level = 'admin5'
      break
  }
  return level
}
