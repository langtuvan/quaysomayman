import { enqueueSnackbar, type SnackbarOrigin } from "notistack";

export const anchorOrigin: SnackbarOrigin = {
  vertical: "bottom",
  horizontal: "center",
};

export default class useSnackbar {
  static success(message: string) {
    return enqueueSnackbar(message || "successfully!", {
      variant: "success",
      anchorOrigin,
    });
  }
  static error(message: string) {
    return enqueueSnackbar(message || "Has a Error!", {
      variant: "error",
      anchorOrigin,
    });
  }
  static warning(message: string) {
    return enqueueSnackbar(message || "Has a warning!", {
      variant: "warning",
      anchorOrigin,
    });
  }
}
