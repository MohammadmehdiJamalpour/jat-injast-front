import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';


import Vote from './../ui/Vote';

/**
 * Builds the Leaflet marker “badge”:
 *   ▸ Price (or title fallback)
 *   ▸ Small star-rating widget (Vote size="sm")
 * Returns an L.DivIcon so MapSection can feed it to <Marker icon={…} />.
 */
function MarkerBadge({ price, title, rating }) {
  // Render the small-size Vote component as a raw HTML string
  const voteHtml = rating
    ? ReactDOMServer.renderToString(<Vote vote={rating} color="primary-600" size="sm" />)
    : '';

  // Main label (price preferred, otherwise title)
  const label = price || title;

  return L.divIcon({
    html: `
      <div
        class="flex items-center gap-1  justify-center
               font-sans  rounded-3xl
               min-w-44 px-2.5 py-1 text-[12px] shadow-lg
               transform -translate-x-1/2 -translate-y-1/2"
        style="white-space:nowrap;background:#0084a6;color:#f2fbfd;"
      >
        <span>${label}</span>
        ${voteHtml}
      </div>
    `,
    className: '',      // override Leaflet’s default styling class
    iconAnchor: [0, 0], // keep the badge centered on the coordinate
  });
}

export default MarkerBadge;
