import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"

import { storage } from "./config"

export async function uploadFile({
  folder,
  file,
  setProgress,
  setStatus,
}: {
  folder: string
  file: File
  setProgress?: (p: number) => void
  setStatus?: (s: "paused" | "running") => void
}): Promise<{
  url: string
  fileRef: string
  fileType: string
  fileName: string
}> {
  const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`)
  const fileType = file.type

  // Upload the file and metadata
  const uploadTask = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log("Upload is " + progress + "% done")
        if (setProgress) setProgress(progress)
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused")
            if (setStatus) setStatus("paused")
            break
          case "running":
            console.log("Upload is running")
            if (setStatus) setStatus("running")
            break
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        reject(error)
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL)
          resolve({
            url: downloadURL,
            fileRef: storageRef.fullPath,
            fileType,
            fileName: file.name,
          })
        })
      }
    )
  })
}

export function deleteFile(path: string) {
  const storageRef = ref(storage, path)

  return deleteObject(storageRef)
}
