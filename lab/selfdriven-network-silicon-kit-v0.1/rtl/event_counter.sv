// EDUCATIONAL DESIGN ONLY. NOT a secure monotonic counter.
// Reset clears state; no nonvolatile storage, anti-rollback or tamper protection.
module event_counter #(parameter WIDTH = 8) (
    input logic clk,
    input logic rst_n,
    input logic increment,
    output logic [WIDTH-1:0] count,
    output logic overflow
);
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count <= '0;
      overflow <= 1'b0;
    end else if (increment && !overflow) begin
      if (count == {WIDTH{1'b1}})
        overflow <= 1'b1;
      else
        count <= count + 1'b1;
    end
  end
endmodule
