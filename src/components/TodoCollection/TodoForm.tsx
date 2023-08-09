import { Input, DatePicker, Space } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { whatIsToday } from "./today";
import { postTodo } from "api/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITodo, ITodoforInsert } from "supabase/database.types";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const TodoForm: React.FC = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [deadline, setDeadline] = useState<string | undefined>(whatIsToday());
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "title") {
      setTitle(e.target.value);
    } else if (e.target.name === "content") {
      setContent(e.target.value);
    }
  };
  const onDayChange = (e: dayjs.Dayjs | null) => {
    const checkDate = e?.format().split("T")[0];
    console.log("✅", checkDate);
    setDeadline(checkDate);
  };

  const todoPostMutation = useMutation(postTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    }
  });

  // TODO email : auth연결하면 수정해줘야함. + tag 기능 추가하면 수정해줘야함. (현재 임의로 지정)
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTodo: ITodoforInsert = {
      email: "jieun2563@naver.com",
      title,
      content,
      isDone: false,
      tag: { edu: false },
      deadLineDate: deadline
    };
    todoPostMutation.mutate(newTodo);
    setTitle("");
    setContent("");
    setDeadline(whatIsToday());
  };
  return (
    <form onSubmit={e => onSubmitHandler(e)}>
      <Input
        name="title"
        showCount
        maxLength={30}
        value={title}
        onChange={onChange}
        placeholder="제목을 입력하세요"
      />
      <TextArea
        name="content"
        showCount
        maxLength={50}
        style={{ height: 50, resize: "none" }}
        value={content}
        onChange={onChange}
        placeholder="내용을 입력하세요"
      />
      <Space direction="vertical" size={12}>
        <DatePicker
          name="deadline"
          bordered={false}
          defaultValue={dayjs(deadline)}
          onChange={e => onDayChange(e)}
        />
      </Space>

      <input type="text" name="tag" defaultValue={"여기는 일단 보류"} />
      <button type="submit">저장</button>
    </form>
  );
};
export default TodoForm;
