"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../commands/util");
const DEFINITIONS = {
    apexclass: {
        type: 'ApexClass',
        suffix: 'cls',
        directory: 'classes',
        pathStrategy: util_1.PathStrategyFactory.createDefaultStrategy(),
        extensions: ['.cls']
    },
    apexcomponent: {
        type: 'ApexComponent',
        suffix: 'component',
        directory: 'components',
        pathStrategy: util_1.PathStrategyFactory.createDefaultStrategy(),
        extensions: ['.component']
    },
    apexpage: {
        type: 'ApexPage',
        suffix: 'page',
        directory: 'pages',
        pathStrategy: util_1.PathStrategyFactory.createDefaultStrategy(),
        extensions: ['.page']
    },
    apextrigger: {
        type: 'ApexTrigger',
        suffix: 'trigger',
        directory: 'triggers',
        pathStrategy: util_1.PathStrategyFactory.createDefaultStrategy(),
        extensions: ['.trigger']
    },
    auradefinitionbundle: {
        type: 'AuraDefinitionBundle',
        suffix: 'cmp',
        directory: 'aura',
        pathStrategy: util_1.PathStrategyFactory.createBundleStrategy(),
        extensions: ['.app', '.cmp', '.evt', '.intf']
    },
    customobject: {
        type: 'CustomObject',
        suffix: 'object',
        directory: 'objects',
        pathStrategy: util_1.PathStrategyFactory.createBundleStrategy()
    },
    experiencebundle: {
        type: 'ExperienceBundle',
        suffix: 'json',
        directory: 'experiences',
        pathStrategy: util_1.PathStrategyFactory.createBundleStrategy()
    },
    lightningcomponentbundle: {
        type: 'LightningComponentBundle',
        suffix: 'js',
        directory: 'lwc',
        pathStrategy: util_1.PathStrategyFactory.createBundleStrategy(),
        extensions: ['.js', '.html']
    },
    wavetemplatebundle: {
        type: 'WaveTemplateBundle',
        suffix: 'waveTemplate',
        directory: 'waveTemplates',
        pathStrategy: util_1.PathStrategyFactory.createWaveTemplateBundleStrategy(),
        extensions: ['']
    },
    functionjs: {
        type: 'function',
        suffix: '',
        directory: 'functions',
        pathStrategy: util_1.PathStrategyFactory.createFunctionTemplateStrategy(),
        extensions: ['.js', '.ts']
    },
    functionjava: {
        type: 'function',
        suffix: '',
        directory: 'functions',
        pathStrategy: util_1.PathStrategyFactory.createFunctionJavaTemplateStrategy(),
        extensions: ['.java']
    }
};
class MetadataDictionary {
    static getInfo(metadataType) {
        return DEFINITIONS[metadataType.toLowerCase()];
    }
}
exports.MetadataDictionary = MetadataDictionary;
//# sourceMappingURL=metadataDictionary.js.map