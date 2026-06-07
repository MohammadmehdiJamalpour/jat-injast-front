
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

function CustomZoomControl() {
  const map = useMap();

  useEffect(() => {
    const CustomControl = L.Control.extend({
      onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-bar custom-control');

        // Zoom In Button
        const zoomInButton = L.DomUtil.create('a', 'custom-zoom-in', container);
        zoomInButton.innerHTML = '+';
        zoomInButton.href = '#';

        // Set styles directly on the zoomInButton
        zoomInButton.style.backgroundColor = '#ffffff';
        zoomInButton.style.color = '#006f8c';
        zoomInButton.style.fontSize = '18px';
        zoomInButton.style.width = '40px';
        zoomInButton.style.height = '40px';
        zoomInButton.style.display = 'flex';
        zoomInButton.style.alignItems = 'center';
        zoomInButton.style.justifyContent = 'center';
        zoomInButton.style.textDecoration = 'none';
        zoomInButton.style.borderRadius = '50%';
        zoomInButton.style.marginBottom = '5px';
        zoomInButton.style.padding = '0';
        zoomInButton.style.border = '1px solid rgba(0, 111, 140, 0.14)';
        zoomInButton.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
        zoomInButton.style.cursor = 'pointer';

        // Zoom Out Button
        const zoomOutButton = L.DomUtil.create('a', 'custom-zoom-out', container);
        zoomOutButton.innerHTML = '-';
        zoomOutButton.href = '#';

        // Set styles directly on the zoomOutButton
        zoomOutButton.style.backgroundColor = '#ffffff';
        zoomOutButton.style.color = '#006f8c';
        zoomOutButton.style.fontSize = '18px';
        zoomOutButton.style.width = '40px';
        zoomOutButton.style.height = '40px';
        zoomOutButton.style.display = 'flex';
        zoomOutButton.style.alignItems = 'center';
        zoomOutButton.style.justifyContent = 'center';
        zoomOutButton.style.textDecoration = 'none';
        zoomOutButton.style.borderRadius = '50%';
        zoomOutButton.style.marginBottom = '0';
        zoomOutButton.style.padding = '0';
        zoomOutButton.style.border = '1px solid rgba(0, 111, 140, 0.14)';
        zoomOutButton.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
        zoomOutButton.style.cursor = 'pointer';

        // Event Listeners for Click
        L.DomEvent.on(zoomInButton, 'click', function (e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          map.zoomIn();
        });

        L.DomEvent.on(zoomOutButton, 'click', function (e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          map.zoomOut();
        });

        // Event Listeners for Hover Effects
        // Zoom In Button Hover
        L.DomEvent.on(zoomInButton, 'mouseenter', function () {
          zoomInButton.style.backgroundColor = '#ffffff';
          zoomInButton.style.color = '#003444';
        });
        L.DomEvent.on(zoomInButton, 'mouseleave', function () {
          zoomInButton.style.backgroundColor = '#ffffff';
          zoomInButton.style.color = '#006f8c';
        });

        // Zoom Out Button Hover
        L.DomEvent.on(zoomOutButton, 'mouseenter', function () {
          zoomOutButton.style.backgroundColor = '#ffffff';
          zoomOutButton.style.color = '#003444';
        });
        L.DomEvent.on(zoomOutButton, 'mouseleave', function () {
          zoomOutButton.style.backgroundColor = '#ffffff';
          zoomOutButton.style.color = '#006f8c';
        });

        return container;
      },
    });

    const customControl = new CustomControl({ position: 'bottomright' });
    map.addControl(customControl);

    // Cleanup on unmount
    return () => {
      map.removeControl(customControl);
    };
  }, [map]);

  return null;
}

export default CustomZoomControl;
