import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/lib/constants"

/**
 * Sube un archivo a Cloudinary y devuelve su URL segura.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Error al subir el archivo a Cloudinary")
  }

  const data = await response.json()
  return data.secure_url
}

export async function uploadMultipleToCloudinary(files: File[]) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`
  const results = {
    successful: [] as string[],
    failed: [] as { file: string; error: string }[],
  }

  const uploadPromises = Array.from(files).map((file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

    return fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.secure_url) {
          results.successful.push(data.secure_url as string)
        } else {
          results.failed.push({ file: file.name, error: data.error.message })
        }
      })
      .catch((error) => {
        results.failed.push({ file: file.name, error: error.message })
      })
  })

  await Promise.allSettled(uploadPromises)

  return results
}
