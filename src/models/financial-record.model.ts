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
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

financialRecordSchema.index({ date: -1, type: 1, category: 1 });

export const FinancialRecordModel = model<IFinancialRecord>(
  "FinancialRecord",
  financialRecordSchema
);
