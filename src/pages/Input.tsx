import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Scanner } from "@yudiel/react-qr-scanner";
import "./Input.css";

export function Input() {
  const [inputText, setInputText] = useState("");
  const [deviceId, setDeviceId] = useState<string>("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isUrlFound, setIsUrlFound] = useState(false);
  const [url, setUrl] = useState("");
  const qrCodeCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchAllWebcamDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const cams = devices.filter((d) => d.kind === "videoinput");

      setDevices(cams);
      console.log(cams);

      if (cams[0]) setDeviceId(cams[0].deviceId);
    };
    fetchAllWebcamDevices();
  }, []);

  const saveInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.currentTarget.value);
  };

  const downloadQrCodeImage = () => {
    const canvas = qrCodeCanvas.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    a.click();
  };

  const showScanner = () => {
    if (isScanning === false) {
      setIsScanning(true);
      setIsUrlFound(false);
    } else {
      setUrl("");
      setIsScanning(false);
    }
  };

  // Output the QR Code Scanner Result
  const displayResult = (url: string) => {
    console.log(url);

    // Update the found url
    setUrl(url);

    // Disable the Scanner after url is found
    setIsUrlFound(true);
  };

  //! Select webcams
  const selectWebCams = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDeviceId(e.currentTarget.value);
  };

  return (
    <div className="input-container">
      {isScanning === false && (
        <input
          onChange={saveInputText}
          value={inputText}
          className="input"
          type="text"
          placeholder="Enter any link"
        />
      )}

      <div className="qr-code-container">
        {inputText !== "" && isScanning === false && (
          <QRCodeCanvas
            ref={qrCodeCanvas}
            value={inputText}
            className="qr-code-image-previewer"
            size={200}
          />
        )}

        {isScanning === true && isUrlFound === false && (
          <div className="qr-code-scanner">
            <select
              value={deviceId}
              title="webcams-selector"
              name="webcams-selector"
              id="webcams-selector"
              className="webcam-selector"
              onChange={selectWebCams}
            >
              {devices.map((device) => {
                return <option value={device.deviceId}>{device.label}</option>;
              })}
            </select>
            <Scanner
              key={deviceId}
              constraints={
                deviceId ? { deviceId: { exact: deviceId } } : undefined
              }
              onScan={(result) => {
                displayResult(result[0].rawValue);
              }}
              onError={(error) => {
                console.error(error);
              }}
            />
          </div>
        )}

        {url !== "" ? (
          <div className="url-text">
            Success:{" "}
            <a target="_blank" href={url}>
              {url}
            </a>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="buttons-container">
        {isScanning === false && inputText !== "" && (
          <button onClick={downloadQrCodeImage} className="download-button">
            Download QR Code
          </button>
        )}
        <button onClick={showScanner} className="download-button">
          {isScanning === false
            ? "Scan QR Code"
            : "Enter link to download QR Code"}
        </button>
      </div>
    </div>
  );
}
