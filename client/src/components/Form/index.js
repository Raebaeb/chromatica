import axios from "axios";
import { useState, React, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { baseURL, config } from "../../services";
import ColorInput1 from "../ColorInputs/ColorInput1";
import ColorInput2 from "../ColorInputs/ColorInput2";
import ColorInput3 from "../ColorInputs/ColorInput3";
import "./form.css";

const Form = (props) => {
  const params = useParams();
  const history = useHistory();
  const [paletteName, setPaletteName] = useState("");
  const [username, setUsername] = useState("");
  const [color1, setColor1] = useState("#A7ABAE");
  const [color2, setColor2] = useState("#A7ABAE");
  const [color3, setColor3] = useState("#A7ABAE");
  const [name1, setName1] = useState("...");
  const [name2, setName2] = useState("...");
  const [name3, setName3] = useState("...");

  useEffect(() => {
    if (params.id) {
      const palette = props.palettes.find(
        (palette) => palette.id === params.id
      );
      if (palette) {
        setPaletteName(palette.fields.palette);
        setUsername(palette.fields.username);
        setColor1(palette.fields.hex1);
        setColor2(palette.fields.hex2);
        setColor3(palette.fields.hex3);
        setName1(palette.fields.color1);
        setName2(palette.fields.color2);
        setName3(palette.fields.color3);
      }
    }
  }, [params.id, props.palettes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPalette = {
      fields: {
        palette: paletteName,
        hex1: color1,
        hex2: color2,
        hex3: color3,
        username: username,
        color1: name1,
        color2: name2,
        color3: name3
      },
    };
    if (params.id) {
      await axios.put(`${baseURL}/${params.id}`, newPalette, config);
    } else {
      await axios.post(baseURL, newPalette, config);
    }
    props.setToggleFetch((curr) => !curr);
    history.push("/");
  };
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  async function copyText(e) {
    if (!navigator.clipboard) {
      return
    }
    const text = e.target.innerText
    try {
      await navigator.clipboard.writeText(text);
      e.target.className = "color-code copied"
      e.target.textContent = "copied!"
      setTimeout(() => {
        e.target.className = "color-code";
        e.target.textContent = text;
      }, 1000)
    } catch (err) {
      console.error('Failed to copy!', err)
    }
  };
  
  const fetchName = async (hexCode, setcolorName) => {
    const colorCode = hexCode.replace('#', '')
    const response = await axios.get(`https://www.thecolorapi.com/id?hex=${colorCode}`);
    setcolorName(response.data.name.value);
  }

  return (
      <form onSubmit={handleSubmit}>
        <input
          required
          focus="true"
          autoComplete="off"
          type="text"
          id="form-palette"
          name="palette name"
          placeholder="palette name"
          value={paletteName}
          onChange={(e) => setPaletteName(e.target.value)}
        />
        {params.id ? (
          <h4 id='edit-user'>by: {username}</h4>
        ) : (
          <input
            required
            maxLength='9'
            autoComplete="off"
            type="text"
            id="form-user"
            name="username"
            placeholder="your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <div id='col-inputs-container'>
          <ColorInput1 color1={color1} name1={name1} setColor1={setColor1} setName1={setName1} hexToRgb={hexToRgb} copyText={copyText} fetchName={fetchName}/>
          <ColorInput2 color2={color2} name2={name2} setColor2={setColor2} setName2={setName2} hexToRgb={hexToRgb} copyText={copyText} fetchName={fetchName}/>
          <ColorInput3 color3={color3} name3={name3} setColor3={setColor3} setName3={setName3} hexToRgb={hexToRgb} copyText={copyText} fetchName={fetchName}/>
        </div>
        <button type="submit" id="submit-btn">
          save palette
        </button>
      </form>
  );
};

export default Form;
