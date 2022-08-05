import React from 'react'
import { Loading } from '@alifd/next'
import {
  buildComponents,
  assetBundle,
  AssetLevel,
  AssetLoader,
} from '@alilc/lowcode-utils'
import ReactRenderer from '@alilc/lowcode-react-renderer'
import { injectComponents } from '@alilc/lowcode-plugin-inject'
import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler'

class LowCodeAnalysis extends React.Component {
  state = {
    data: {},
  }

  init = async () => {
    const { projectSchema, packages } = this.props
    const { componentsMap: componentsMapArray, componentsTree } = projectSchema
    const componentsMap = {}
    componentsMapArray.forEach((component) => {
      componentsMap[component.componentName] = component
    })
    const schema = componentsTree[0]

    const libraryMap = {}
    const libraryAsset = []
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library
      if (renderUrls) {
        libraryAsset.push(renderUrls)
      } else if (urls) {
        libraryAsset.push(urls)
      }
    })

    const vendors = [assetBundle(libraryAsset, AssetLevel.Library)]

    // TODO asset may cause pollution
    const assetLoader = new AssetLoader()
    await assetLoader.load(libraryAsset)
    const components = await injectComponents(
      buildComponents(libraryMap, componentsMap)
    )

    this.setState({
      data: {
        schema,
        components,
      },
    })
  }
  render () {
    const { schema, components } = this.state.data

    if (!schema || !components) {
      this.init()
      return <Loading fullScreen />
    }

    return (
      <div className="lowcode-plugin-sample-preview">
        <ReactRenderer
          className="lowcode-plugin-sample-preview-content"
          schema={schema}
          components={components}
          appHelper={{
            requestHandlersMap: {
              fetch: createFetchHandler(),
            },
          }}
        />
      </div>
    )
  }
}
export default LowCodeAnalysis
