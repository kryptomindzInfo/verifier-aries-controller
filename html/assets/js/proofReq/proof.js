$(function () {
  var settings = {
    url: HOST + "/present-proof/records",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    let proofs = response.results;

    var verified_count = 0;
    var pending_count = 0;
    var declined_count = 0;
    for (var proof of proofs) {
      var initiator_str = "";
      if (proof.initiator == "self") {
        initiator_str = "Sent&nbsp;";
      }
      if (proof.initiator == "external") {
        initiator_str = "Received&nbsp;";
      }
      var verified_div = "";
      if (proof.verified == true) {
        verified_div = `<div>
        <span>
            <i class="fa fa-check"></i>
        </span>
        &nbsp;
        <span>Verified</span>
    </div>`;
      }

      var status = "";
      if (proof.state == "verified") {
        verified_count++;
        let attrbs = proof.presentation?.requested_proof.revealed_attrs;

        let attrbs_row = "";
        $.each(attrbs, function (k, v) {
          attrbs_row += `
         <tr>
         <td>${k}:</td>
         <td>${
           v.raw.startsWith("data:") ? '<img src="' + v.raw + '"/>' : v.raw
         }</td>
         </tr>`;
        });

        let prdcts = proof.presentation?.requested_proof.predicates;
        $.each(prdcts, function (k, v) {
          attrbs_row += `
         <tr>
         <td>${k}:</td>
         <td>Pass</td>
         </tr>`;
        });

        status = `<div class="myDIV text-success"><i class="icon-check text-success"></i>  Verified</div>
        <div class="hide">
        <table>
        ${attrbs_row}
        </table>
        </div>`;
      } else if (proof.state == "abandoned") {
        declined_count++;
        status = `<i class="icon-close text-danger"></i>  <span class="text-danger">Declined</span>`;
      } else {
        pending_count++;
        status = `<i class="icon-clock text-warning"></i>  <span class="text-warning">Pending</span>`;
      }
      $("#proofs-div").append(`<div class="card shadow-sm" >
        <div class="card-body" >
            <div class="card-title">
                <h5>
                    <span>${proof.presentation_request.name}</span>
                    <span>&nbsp;(${proof.presentation_request.version})</span>
                </h5>
                <small>
                    <span>${initiator_str}</span>
                </small>
                <small class="text-muted">${proof.created_at}</small>
            </div>
            <div class="card-text">
                <div>
                    <small class="text-muted">Presentation Exchange ID:&nbsp;</small>
                    <p>${proof.presentation_exchange_id}</p>
                </div>
                <div>
                ${status}
            </div>
            </div>
        </div>
        <div class="card-footer">
            <p class="card-text">
                <small class="text-muted">Updated at ${proof.updated_at}</small>
            </p>
        </div>
    </div>`);
    }
    console.log(verified_count, pending_count, declined_count);
    $("#verified-count").html(verified_count);
    $("#pending-count").html(pending_count);
    $("#declined-count").html(declined_count);
  });
});

$("#presentModal").on("show.bs.modal", function (e) {
  let cols = $(e.relatedTarget).closest("tr").find("td");
  let user_id = $(e.relatedTarget).data("id");
});
