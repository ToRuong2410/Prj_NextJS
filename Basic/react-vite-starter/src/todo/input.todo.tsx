//  compile: dịch code => convert từ typescript -> javascript (check type)
// run: chạy code

import React, { Children, useState } from "react";

// Viết type, định nghĩa kiểu giá trị được truyền sang -> giúp khi viết code sẽ dễ dàng được gợi ý code
interface IProps {
  name?: string; // optional
  age: number;
  info: {
    gender: string;
    address: string;
  };
  truongFunction: (value: string) => void;
  listTodo: string[]; //kiểu string array
  setListTodo: (value: string[]) => void;
  children: React.ReactNode;
}

function InputToDo(props: IProps) {
  // props: object
  const { listTodo, setListTodo, truongFunction } = props; // object destructuring

  const [todo, setTodo] = useState("");

  const handleClick = () => {
    if (!todo) {
      alert("empty todo");
      return; // nếu todo rỗng sẽ thoát khỏi function
    }

    console.log(">>> Gia tri nhap:", todo);
    setListTodo([...listTodo, todo]); // spread syntax
    setTodo("");
  };

  return (
    <div style={{ border: "1px solid red", padding: "10px" }}>
      <div>Add new todo</div>
      {props.children}
      <input
        value={todo}
        type="text"
        onChange={(event) => {
          setTodo(event.target.value);
        }}
      />
      &nbsp;&nbsp; {/* // non-breaking space */}
      <button
        onClick={() => {
          handleClick();
        }}
      >
        Save
      </button>
    </div>
  );
}

export default InputToDo;
