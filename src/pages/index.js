import React from 'react'
import Schema from './Schema'
import Packages from './Packages'
import LowCodeAnalysis from '../components/LowCodeAnalysis'

console.log(Schema, Packages)
class LowCode extends React.Component {
  render () {
    return (
      <>
        <LowCodeAnalysis projectSchema={Schema} packages={Packages} />
      </>
    )
  }
}

export default LowCode