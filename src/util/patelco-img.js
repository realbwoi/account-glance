var patelcoImg = "data:image/png;base64,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";

export default patelcoImg;