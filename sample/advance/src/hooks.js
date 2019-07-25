import React, { useState } from 'react'

function withMutator(mutator) {
  return setState => newVal => setState(mutator(newVal))
}

function add(setState, n) {
  return withMutator(newVal => newVal + n)(setState)
}

function square(setState) {
  return withMutator(newVal => (newVal * newVal))(setState)
}

function useSubtract(initial) {
  return useState(initial)
}

export default function Hooks() {
  const [count, setCount] = useState(0)
  const addCount = add(setCount, 2)
  const squareCount = square(setCount)
  const [foo, setFoo] = useSubtract(10)
  return <div>
    <button onClick={() => addCount(count)}>Add Count: {count}</button>
    <button onClick={() => squareCount(count)}>Square Count: {count}</button>
    <button onClick={() => setFoo(foo)}>Square Count: {foo}</button>
  </div>
}
