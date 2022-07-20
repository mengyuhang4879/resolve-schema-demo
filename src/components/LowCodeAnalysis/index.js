import React, { useState } from 'react';
import { Loading } from '@alifd/next';
import { buildComponents, assetBundle, AssetLevel, AssetLoader } from '@alilc/lowcode-utils';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { injectComponents } from '@alilc/lowcode-plugin-inject';

const LowCodeAnalysis = () => {
  const [data, setData] = useState({});

  async function init() {
    // 渲染前置处理，初始化项目 schema 和资产包为渲染模块所需的 schema prop 和 components prop
    const packages = JSON.parse(window.localStorage.getItem('packages') || '');
    const projectSchema = JSON.parse(window.localStorage.getItem('projectSchema') || '');
    const { componentsMap: componentsMapArray, componentsTree } = projectSchema;
    const componentsMap = {};
    componentsMapArray.forEach((component) => {
      componentsMap[component.componentName] = component;
    });
    const schema = componentsTree[0];

    const libraryMap = {};
    const libraryAsset = [];
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });

    const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];

    const assetLoader = new AssetLoader();
    await assetLoader.load(libraryAsset);
    // const components = await injectComponents(buildComponents(libraryMap, componentsMap));

    setData({
      schema,
      components,
    });
  }

  const { schema, components } = data;

  if (!schema || !components) {
    init();
    return <Loading fullScreen />;
  }

  return (
      <div className="lowcode-plugin-sample-preview">
        <ReactRenderer
            className="lowcode-plugin-sample-preview-content"
            schema={schema}
            components={components}
        />
      </div>
  );
};

export default LowCodeAnalysis