const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
  imageUrl: { type: String, required: true },  // 存储图片的相对路径
  imageName: { type: String },  // 存储原始图片名称
  uploadedAt: { type: Date, default: Date.now },  // 图片上传时间
  userId: { type: Schema.Types.ObjectId, ref: 'User' }  // 关联用户（可选）
},opts);

ImageSchema.virtual('imageUrlFormatted').get(function() {
  // 将反斜杠替换为正斜杠
  return this.imageUrl.replace('/\\/g', '/');
});
ImageSchema.set('toJSON', { virtuals: true });
ImageSchema.set('toObject', { virtuals: true });
module.exports = mongoose.model('Image', ImageSchema);
