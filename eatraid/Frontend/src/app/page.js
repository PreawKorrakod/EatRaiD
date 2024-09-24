import styles from "./page.module.css";
import Navbar from "../../components/Navbar";
import SpinningWheel from "../../components/SpinningWheel";

export default function Home() {

  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

  return (
    <div className={styles.page}>
      <Navbar></Navbar>
      <h1>Spinning Wheel</h1>
      <SpinningWheel options={options} />
    </div>
  );
}