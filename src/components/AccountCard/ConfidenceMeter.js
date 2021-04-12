import React from "react";
import { Progress } from "reactstrap";

const ConfidenceMeter = (props) => {

    const getColor = (strength) => {
      strength = parseFloat(strength)
  
      if (strength <= 3) {
        return "danger"
      }
      else if (strength <= 5) {
        return "warning"
      }
      else if (strength <= 8) {
        return "info"
      }
      else {
        return "success"
      }
    }
  
    const confidence = props.confidence;
  
    let color = getColor(confidence)
  
    console.log(color)
  
    return <Progress value={confidence} max={10} className="progressBar" color={color}>{`${confidence * 10}%`}</Progress>
  };

export default ConfidenceMeter;