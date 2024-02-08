"use strict";
const PROOF_REQ = {
  connection_id: "",
  proof_request: {
    name: "",
    version: "",
    requested_attributes: {},
    requested_predicates: {},
  },
};
var data;

// var ATTRIBUTE = {
//   name: "",
//   restrictions: [
//     {
//       cred_def_id: "",
//     },
//   ],
// };
// var PREDICATE = {
//   name: "",
//   p_type: "",
//   p_value: 0,
//   restrictions: [
//     {
//       cred_def_id: "",
//     },
//   ],
// };

$(async function () {
  var response = await fetch("../data.json");
  data = await response.json();
  if (!data) {
    alert("Credential Definition data missing.");
  }

  var settings = {
    url: HOST + "/connections",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    let connections = response.results;
    let count = 0;
    for (let connection of connections) {
      count++;
      if (connection.state == "active" || connection.state == "request") {
        $("#list-connections").append(
          $("<option>")
            .val(connection.connection_id)
            .text(connection.their_label + " " + connection.connection_id)
        );
      }
    }
  });
});

$("#req-proof-btn").on("click", function () {
  let proof_req = JSON.parse(JSON.stringify(PROOF_REQ));
  let connection_id = $("#list-connections").val();
  if (!connection_id) {
    alert("Select connection.");
    return;
  }

  let full_name = $("#full-name-ep").is(":checked");
  let issue_date = $("#date-of-issue-ep").is(":checked");
  let validity = $("#validity-ep").is(":checked");
  let field_study = $("#field-study-ep").is(":checked");
  if (!full_name && !issue_date && !validity && !field_study) {
    alert("Select attributes.");
    return;
  }
  proof_req.connection_id = connection_id;
  proof_req.proof_request.name = "Proof of Education";
  proof_req.proof_request.version = "1.0";
  var restrictions = [
    {
      cred_def_id: data.ACADEMIC.definition,
    },
  ];
  if (full_name) {
    proof_req.proof_request.requested_attributes["0_name_uuid"] = {
      name: "name",
      restrictions,
    };
  }
  if (issue_date) {
    proof_req.proof_request.requested_attributes["0_date_uuid"] = {
      name: "date",
      restrictions,
    };
  }
  if (validity) {
    proof_req.proof_request.requested_attributes["0_validity_uuid"] = {
      name: "timestamp",
      restrictions,
    };
  }
  if (field_study) {
    proof_req.proof_request.requested_attributes["0_degree_uuid"] = {
      name: "degree",
      restrictions,
    };
  }
  var settings = {
    url: HOST + "/present-proof/send-request",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(proof_req),
  };

  $.ajax(settings).done(function (response) {
    alert("Proof Request Sent.");
  });
});

$("#req-proof-btn-2").on("click", function () {
  let proof_req2 = JSON.parse(JSON.stringify(PROOF_REQ));
  let connection_id = $("#list-connections").val();
  if (!connection_id) {
    alert("Select connection.");
    return;
  }

  let full_name = $("#full-name-ap").is(":checked");
  let age = $("#age-ge-18").is(":checked");
  if (!full_name && !age) {
    alert("Select attributes.");
    return;
  }
  proof_req2.connection_id = connection_id;
  proof_req2.proof_request.name = "Age Proof";
  proof_req2.proof_request.version = "1.0";
  var restrictions = [
    {
      cred_def_id: data.LICENSE.definition,
    },
  ];
  if (full_name) {
    proof_req2.proof_request.requested_attributes["0_name_uuid"] = {
      name: "full_name",
      restrictions,
    };
  }
  if (age) {
    let birth_le = subtractYears(new Date(), 18);
    proof_req2.proof_request.requested_predicates["0_age_ge_uuid"] = {
      name: "birth_date",
      p_type: "<=",
      p_value: birth_le,
      restrictions,
    };
  }

  var settings = {
    url: HOST + "/present-proof/send-request",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(proof_req2),
  };

  $.ajax(settings).done(function (response) {
    alert("Proof Request Sent.");
  });
});

$("#req-proof-btn-3").on("click", function () {
  let proof_req3 = JSON.parse(JSON.stringify(PROOF_REQ));
  let connection_id = $("#list-connections").val();
  if (!connection_id) {
    alert("Select connection.");
    return;
  }

  let full_name = $("#full-name-adp").is(":checked");
  let address = $("#address-adp").is(":checked");
  if (!full_name && !address) {
    alert("Select attributes.");
    return;
  }
  proof_req3.connection_id = connection_id;
  proof_req3.proof_request.name = "Address Proof";
  proof_req3.proof_request.version = "1.0";
  var restrictions = [
    {
      cred_def_id: data.LICENSE.definition,
    },
  ];
  if (full_name) {
    proof_req3.proof_request.requested_attributes["0_name_uuid"] = {
      name: "full_name",
      restrictions,
    };
  }
  if (address) {
    proof_req3.proof_request.requested_attributes["0_address_uuid"] = {
      name: "address",
      restrictions,
    };
  }

  var settings = {
    url: HOST + "/present-proof/send-request",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(proof_req3),
  };

  $.ajax(settings).done(function (response) {
    alert("Proof Request Sent.");
  });
});

$("#req-proof-btn-4").on("click", function () {
  let proof_req4 = JSON.parse(JSON.stringify(PROOF_REQ));
  let connection_id = $("#list-connections").val();
  if (!connection_id) {
    alert("Select connection.");
    return;
  }

  let start_date = $("#mem-start-date").is(":checked");
  let mem_type = $("#mem-type").is(":checked");
  let mem_group = $("#mem-group").is(":checked");
  if (!start_date && !mem_type && !mem_group) {
    alert("Select attributes.");
    return;
  }
  proof_req4.connection_id = connection_id;
  proof_req4.proof_request.name = "Membership Proof";
  proof_req4.proof_request.version = "1.0";
  var restrictions = [
    {
      cred_def_id: data.MEMBERSHIP.definition,
    },
  ];
  if (start_date) {
    proof_req4.proof_request.requested_attributes["0_date_uuid"] = {
      name: "start_date",
      restrictions,
    };
  }
  if (mem_type) {
    proof_req4.proof_request.requested_attributes["0_type_uuid"] = {
      name: "type",
      restrictions,
    };
  }

  if (mem_group) {
    proof_req4.proof_request.requested_attributes["0_group_uuid"] = {
      name: "group",
      restrictions,
    };
    proof_req4.proof_request.requested_attributes["0_logo_uuid"] = {
      name: "logo",
      restrictions,
    };
  }

  var settings = {
    url: HOST + "/present-proof/send-request",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(proof_req4),
  };

  $.ajax(settings).done(function (response) {
    alert("Proof Request Sent.");
  });
});

function subtractYears(date, years) {
  date.setFullYear(date.getFullYear() - years);

  return Math.floor(date.getTime() / 1000);
}
