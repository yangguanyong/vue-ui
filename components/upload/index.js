import upload from './src/upload'
import uploadFile from './src/upload-file'
import uploadImg from './src/upload-img'

const components = [ upload, uploadFile, uploadImg ]
components.forEach(node => {
  node.install = function (Vue) {
    Vue.component(node.name, node)
  }
})

export const _Upload = upload
export const _UploadFile = uploadFile
export const _UploadImg = uploadImg 