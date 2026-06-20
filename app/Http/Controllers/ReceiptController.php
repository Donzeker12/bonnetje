<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReceiptController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()
                ->receipts()
                ->with('store:id,name,chain,address,city')
                ->latest()
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'image' => 'required|image|max:5120',
            'ocr_raw_text' => 'nullable|string',
            'purchase_date' => 'nullable|date',
            'total_amount' => 'nullable|numeric|min:0',
            'auto_process' => 'nullable|boolean',
        ]);

        $path = $request->file('image')->store('receipts', 'public');

        $receipt = Receipt::create([
            'user_id' => $request->user()->id,
            'store_id' => $validated['store_id'],
            'image_path' => $path,
            'ocr_raw_text' => $validated['ocr_raw_text'] ?? null,
            'purchase_date' => $validated['purchase_date'] ?? null,
            'total_amount' => $validated['total_amount'] ?? null,
            'status' => 'pending',
        ]);

        if ($validated['auto_process'] ?? false) {
            $receipt->process();
            $receipt->refresh();
        }

        return response()->json([
            'message' => ($validated['auto_process'] ?? false) ? 'Bon geupload en verwerkt' : 'Bon geupload',
            'receipt' => $receipt->load('store:id,name,chain,address,city'),
            'image_url' => Storage::url($path),
        ], 201);
    }

    public function show(Request $request, Receipt $receipt)
    {
        abort_unless($receipt->user_id === $request->user()->id, 403);

        return response()->json($receipt->load('store:id,name,chain,address,city'));
    }

    public function process(Request $request, Receipt $receipt)
    {
        abort_unless($receipt->user_id === $request->user()->id, 403);

        $receipt->process();

        return response()->json([
            'message' => 'Bon verwerkt',
            'receipt' => $receipt->fresh()->load('store:id,name,chain,address,city'),
        ]);
    }
}