import Marker from '../static/marker.png'


const markerStyle: any = {
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translate(-50%, -100%)",
  height: "30px"
};

export const MapMarker = ({text}: any) => <div><img style={markerStyle} src={Marker} alt="pin" /></div>;
