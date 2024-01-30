import React from 'react'

const CurrentQuestion = ({question}:{question:any}) => {
  return (
    <div>{JSON.stringify(question)}</div>
  )
}

export default CurrentQuestion