// import "./App.css";
import { useState } from "react";
import InputToDo from "./todo/input.todo";

const ChildrenComponent = () => {
  return <div>i'm children components</div>;
};

function App() {
  const name = "Hoi dan IT";
  const age = 22;
  const info = {
    gender: "male",
    address: "Ha noi",
  };
  const [listTodo, setListTodo] = useState([
    "Todo 1",
    "Todo 2",
    "Todo 3",
    "Todo 4",
    "Todo 5",
    "Todo 6",
  ]);

  const handleTest = (name: string) => {
    alert(`handleTest with name = ${name}`);
  };
  return (
    <>
      <InputToDo
        name={name}
        age={age}
        info={info}
        truongFunction={handleTest}
        listTodo={listTodo}
        setListTodo={setListTodo}
      >
        <ChildrenComponent />
      </InputToDo>

      <br />
      <ul>
        {listTodo.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
    </>
  );
}

export default App;
