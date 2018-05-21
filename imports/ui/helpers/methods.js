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
          'visibility': 'off'
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
  let day = 'Sun';
  switch (num) {
    case 0:
      {
        day = 'Sun';
        break;
      }
    case 1:
      {
        day = 'Mon';
        break;
      }
    case 2:
      {
        day = 'Tue';
        break;
      }
    case 3:
      {
        day = 'Wed';
        break;
      }
    case 4:
      {
        day = 'Thu';
        break;
      }
    case 5:
      {
        day = 'Fri';
        break;
      }
    case 6:
      {
        day = 'Sat';
        break;
      }
  }
  return day;

}
