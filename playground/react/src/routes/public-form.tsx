import { GoAPublicFormTask, GoAPublicFormTaskList } from "@abgov/react-components"
import { Link } from "react-router-dom"

export function PublicForm() {
  return (
    <>
      <GoAPublicFormTaskList heading="Public Form">
        <GoAPublicFormTask status="not-started">
          <Link to="/simple-form">Eligibility</Link>
        </GoAPublicFormTask>
        <GoAPublicFormTask status="cannot-start">Some other stuff</GoAPublicFormTask>
      </GoAPublicFormTaskList>
    </>
  )
}
