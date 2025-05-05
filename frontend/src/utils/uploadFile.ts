import { HOST_API } from '@/config-global'
import axiosInstance from './axios'
import { extname } from 'path'

const config = {
  headers: {
    'content-type': 'multipart/form-data',
  },
}

export async function UploadImage(image: File, uploadUrl: string) {
  let body = new FormData()
  body.append('image', image)
  try {
    const response = await axiosInstance.post(
      `${HOST_API}/${uploadUrl}`,
      body,
      config,
    )
    return response.data as string
  } catch (error) {
    return undefined
  }
}

export async function UploadImages(
  images: any,
  newName: string,
  uploadUrl: string,
) {
  let body = new FormData()

  images.map((file: File, index: number) => {
    const timestamp = new Date().getTime() + index
    const fileExtension = file.name.split('.').pop()
    const filename = `${newName}-${timestamp}.${fileExtension}`
    const renamedFile = new File([file], filename, { type: file.type })
    body.append('images', renamedFile)
  })

  try {
    const response = await axiosInstance.post(
      `${HOST_API}/${uploadUrl}`,
      body,
      config,
    )
    return response.data as string[]
  } catch (error) {
    return undefined
  }
}

// export async function createFormData(files: any, newName: string) {
//   let body = new FormData()

//   await files.map((file: File, index: number) => {
//     const timestamp = new Date().getTime() + index
//     const fileExtension = file.name.split('.').pop()
//     const filename = `${newName}-${timestamp}.${fileExtension}`
//     const renamedFile = new File([file], filename, { type: file.type })
//     body.append('images', renamedFile)
//   })

//   return body
// }
