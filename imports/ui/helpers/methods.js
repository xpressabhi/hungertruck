
export const getStyledMapType = function() {
  return new google.maps.StyledMapType([
    {
      'featureType': 'administrative',
      'elementType': 'all',
      'stylers': [
        {
          'visibility': 'on',
          'color': '#aaaaaa'
        }
      ]
    }, {
      'featureType': 'administrative',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#aaaaaa'
        }
      ]
    }, {
      'featureType': 'administrative.locality',
      'elementType': 'labels.text',
      'stylers': [
        {
          'visibility': 'on'
        }, {
          'weight': '0.01'
        }
      ]
    }, {
      'featureType': 'administrative.locality',
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'visibility': 'off'
        }, {
          'hue': '#ff0000'
        }, {
          'invert_lightness': true
        }
      ]
    }, {
      'featureType': 'landscape',
      'elementType': 'all',
      'stylers': [
        {
          'color': '#f2f2f2'
        }
      ]
    }, {
      'featureType': 'poi.business',
      'elementType': 'all',
      'stylers': [
        {
          'visibility': 'on'
        }
      ]
    }, {
      'featureType': 'road',
      'elementType': 'all',
      'stylers': [
        {
          'saturation': -100
        }, {
          'lightness': 45
        }
      ]
    }, {
      'featureType': 'road.highway',
      'elementType': 'all',
      'stylers': [
        {
          'visibility': 'simplified'
        }
      ]
    }, {
      'featureType': 'road.arterial',
      'elementType': 'labels.icon',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    }, {
      'featureType': 'water',
      'elementType': 'all',
      'stylers': [
        {
          'color': '#46bcec'
        }, {
          'visibility': 'on'
        }
      ]
    }
  ], {name: 'Styled Map'});
}

export const getDay = function(num) {
  if (num === 1)
    return 'Mon';
  if (num === 2)
    return 'Tue';
  if (num === 3)
    return 'Wed';
  if (num === 4)
    return 'Thu';
  if (num === 5)
    return 'Fri';
  if (num === 6)
    return 'Sat';
  return 'Sun';
}
