`timescale 1ns/1ps
module tb_event_counter;
  logic clk = 0;
  logic rst_n = 0;
  logic increment = 0;
  logic [7:0] count;
  logic overflow;
  event_counter #(.WIDTH(8)) dut(.clk(clk), .rst_n(rst_n), .increment(increment), .count(count), .overflow(overflow));
  always #5 clk = ~clk;
  initial begin
    #12; rst_n = 1;
    @(negedge clk); increment = 1;
    repeat (3) @(negedge clk);
    increment = 0;
    #1;
    if (count !== 8'd3 || overflow !== 1'b0) $fatal(1, "Expected three increments; got %d", count);
    rst_n = 0;
    #2;
    if (count !== 8'd0) $fatal(1, "Expected reset to zero");
    $display("PASS: educational counter increments, resets (so it is NOT anti-rollback secure)");
    $finish;
  end
endmodule
