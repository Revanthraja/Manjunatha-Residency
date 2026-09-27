import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/src/lib/supabase';

/** Opens the photo library and returns a base64 image, or null if cancelled. */
export async function pickImage(): Promise<{ base64: string; ext: string } | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) throw new Error('Photo library permission was not granted.');

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
    base64: true,
  });
  if (result.canceled || !result.assets[0]?.base64) return null;
  const uri = result.assets[0].uri;
  const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
  return { base64: result.assets[0].base64, ext };
}

/** Uploads a base64 image to the private `attachments` bucket and returns its storage path. */
export async function uploadAttachment(folder: 'id-proofs' | 'repairs', subfolder: string | number, image: { base64: string; ext: string }): Promise<string> {
  const path = `${folder}/${subfolder}/${Date.now()}.${image.ext}`;
  const { error } = await supabase.storage.from('attachments').upload(path, decode(image.base64), {
    contentType: `image/${image.ext === 'jpg' ? 'jpeg' : image.ext}`,
  });
  if (error) throw error;
  return path;
}

/** A short-lived URL to view a private attachment. */
export async function getAttachmentUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from('attachments').createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data?.signedUrl ?? null;
}
