"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { UserInputValue } from "./interfaces";
import { useConversation } from "@/hooks/use-conversation";
import { ImagePlus, SendHorizontalIcon, XCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function UserInput() {
  const {
    register,
    handleSubmit,
    resetField,
    setValue,
    getValues,
    formState: { isDirty, isSubmitting },
  } = useForm<UserInputValue>();

  const { submitUserInput, conversation } = useConversation();

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const onSubmit: SubmitHandler<UserInputValue> = useCallback(
    (data) => {
      submitUserInput({ message: data.message, images: data.images || [] });
      resetField("message");
      setValue("images", []);
      setImagePreviews([]);
    },
    [resetField, submitUserInput, setValue],
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setValue("images", files);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevImagePreviews) => [
        ...prevImagePreviews,
        ...newPreviews,
      ]);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData.items;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image")) {
        const file = items[i].getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    if (files.length > 0) {
      const currentFiles = getValues("images") || [];
      const updatedFiles = [...currentFiles, ...files];
      setValue("images", updatedFiles);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevImagePreviews) => [
        ...prevImagePreviews,
        ...newPreviews,
      ]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default newline behavior
      handleSubmit(onSubmit)(); // Submit the form
    }
  };

  const clearImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    const currentFiles = getValues("images") || [];
    const updatedFiles = currentFiles.filter(
      (_: File, i: number) => i !== index,
    );
    setValue("images", updatedFiles);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-5xl flex-col items-start gap-2 rounded-xl border border-secondary bg-muted/5 p-2 hover:border-primary">
      <Textarea
        {...register("message")}
        rows={6}
        placeholder={
          conversation.length === 0
            ? "Start a new conversation"
            : "Chat with agent"
        }
        className="w-full resize-none rounded-xl border-none py-2 shadow-none placeholder:self-center focus-visible:ring-0"
        disabled={isSubmitting}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
      />
      <div className="flex w-full items-start justify-end border-t pt-2">
        {imagePreviews.length > 0 && (
          <div className="flex flex-grow flex-wrap gap-2 pt-2">
            {imagePreviews.map((preview, index) => (
              <div
                className="relative"
                key={index}>
                <Image
                  src={preview}
                  alt={`Preview ${index}`}
                  className="aspect-square min-w-16 rounded-md object-cover"
                  width={64}
                  height={64}
                />
                <Button
                  type="button"
                  size={"icon"}
                  variant={"secondary"}
                  className="group absolute right-0 top-0 size-4 -translate-y-1/2 translate-x-1/2 rounded-full"
                  onClick={() => clearImage(index)}>
                  <XCircle className="size-4 group-hover:fill-black group-hover:text-white" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex size-9 items-center justify-center rounded-md text-secondary-foreground hover:bg-secondary">
          <Label
            htmlFor="upload-images"
            className="flex cursor-pointer items-center gap-2">
            <ImagePlus className="size-4" />
            <Input
              id="upload-images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </Label>
        </div>
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={!isDirty || isSubmitting}>
          <SendHorizontalIcon className="size-4" />
        </Button>
      </div>
    </form>
  );
}
