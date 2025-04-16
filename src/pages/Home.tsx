import { useState } from "react";
import Ribbon from "../components/Ribbon";

interface Tab {
  title: string;
  id: number;
  content: string;
}

const Home = () => {
  const [titles, setTitles] = useState<Tab[]>([
    {
      title: "Untitled 1",
      id: 1,
      content: "This is the content of Untitled 1",
    },
    {
      title: "Untitled 2",
      id: 2,
      content: "This is the content of Untitled 2",
    },
    {
      title: "Untitled 3",
      id: 3,
      content: "This is the content of Untitled 3",
    },
    {
      title: "Untitled 4",
      id: 4,
      content: "This is the content of Untitled 4",
    },
    {
      title: "Untitled 5",
      id: 5,
      content: "This is the content of Untitled 5",
    },
  ]);

  return (
    <>
      <Ribbon tabs={titles} setTabs={setTitles} />
    </>
  );
};

export default Home;