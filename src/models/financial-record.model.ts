import { HydratedDocument, model, Schema, Types } from "mongoose";

export const RECORD_TYPES = ["income", "expense"] as const;

export type RecordType = (typeof RECORD_TYPES)[number];

export interface IFinancialRecord {
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  notes?: string;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type FinancialRecordDocument = HydratedDocument<IFinancialRecord>;

const financialRecordSchema = new Schema<IFinancialRecord>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: RECORD_TYPES,
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    date: {
      type: Date,
      required: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: undefined
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

financialRecordSchema.index({ isDeleted: 1, date: -1, type: 1, category: 1 });

export const FinancialRecordModel = model<IFinancialRecord>(
  "FinancialRecord",
  financialRecordSchema
);
