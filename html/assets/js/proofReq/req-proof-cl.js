const PROOF_REQ = {
  comment: "Prove this",
  proof_request: {
    name: "",
    version: "",
    requested_attributes: {},
    requested_predicates: {},
  },
};

var data;

$(async function () {
  var response = await fetch("../data.json");
  data = await response.json();
  if (!data) {
    alert("Credential Definition data missing.");
  }
});

function get_public_did() {
  return new Promise((resolve, reject) => {
    var settings = {
      url: HOST + "/wallet/did/public",
      method: "GET",
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      resolve(response);
    });
  });
}

function get_endpoint(did) {
  return new Promise((resolve, reject) => {
    var settings = {
      url: HOST + "/wallet/get-did-endpoint" + "?did=" + did,
      method: "GET",
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      resolve(response.endpoint);
    });
  });
}

function create_presentation(request) {
  console.log(request);
  return new Promise((resolve, reject) => {
    var settings = {
      url: HOST + "/present-proof/create-request",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(request),
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      resolve(response.presentation_request_dict);
    });
  });
}

async function create_request_qrcode(request) {
  var public_did = await get_public_did();
  var endpoint = await get_endpoint(public_did.result.did);
  var presentation_request_dict = await create_presentation(request);
  var data = {
    ...presentation_request_dict,
    "~service": {
      recipientKeys: [public_did.result.verkey],
      serviceEndpoint: endpoint,
    },
  };

  console.log(data);
  $("#pr-qr-code").empty();
  $("#pr-qr-code").qrcode({
    text: JSON.stringify(data),
    width: 512,
    height: 512,
  });
  $("#pr-qr-code").append(
    `<a href="" download="proof-req-qr.png" onclick="download_qr(this)" class="btn btn-primary btn-lg btn-block">Download</a>`
  );
}

function download_qr(link) {
  var canvas = $("#pr-qr-code canvas");
  link.href = canvas[0].toDataURL("image/png;base64");
}

$("#req-proof-btn").on("click", function () {
  var proof_req = JSON.parse(JSON.stringify(PROOF_REQ));
  let full_name = $("#full-name-ep").is(":checked");
  let issue_date = $("#date-of-issue-ep").is(":checked");
  let validity = $("#validity-ep").is(":checked");
  let field_study = $("#field-study-ep").is(":checked");
  if (!full_name && !issue_date && !validity && !field_study) {
    alert("Select attributes.");
    return;
  }
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
  create_request_qrcode(proof_req);
});

$("#req-proof-btn-2").on("click", function () {
  var proof_req = JSON.parse(JSON.stringify(PROOF_REQ));

  let full_name = $("#full-name-ap").is(":checked");
  let age = $("#age-ge-18").is(":checked");
  if (!full_name && !age) {
    alert("Select attributes.");
    return;
  }
  proof_req.proof_request.name = "Age Proof";
  proof_req.proof_request.version = "1.0";
  var restrictions = [
    {
      cred_def_id: data.LICENSE.definition,
    },
  ];
  if (full_name) {
    proof_req.proof_request.requested_attributes["0_name_uuid"] = {
      name: "full_name",
      restrictions,
    };
  }
  if (age) {
    let birth_le = subtractYears(new Date(), 18);
    proof_req.proof_request.requested_predicates["0_age_ge_uuid"] = {
      name: "birth_date",
      p_type: "<=",
      p_value: birth_le,
      restrictions,
    };
  }
  create_request_qrcode(proof_req);
});

$("#req-proof-btn-3").on("click", function () {
  var proof_req = JSON.parse(JSON.stringify(PROOF_REQ));

  let full_name = $("#full-name-adp").is(":checked");
  let address = $("#address-adp").is(":checked");
  if (!full_name && !address) {
    alert("Select attributes.");
    return;
  }
  proof_req.proof_request.name = "Address Proof";
  proof_req.proof_request.version = "1.0";
  var restrictions = [
    {
      cred_def_id: data.LICENSE.definition,
    },
  ];
  if (full_name) {
    proof_req.proof_request.requested_attributes["0_name_uuid"] = {
      name: "full_name",
      restrictions,
    };
  }
  if (address) {
    proof_req.proof_request.requested_attributes["0_address_uuid"] = {
      name: "address",
      restrictions,
    };
  }

  create_request_qrcode(proof_req);
});

$("#req-proof-btn-4").on("click", function () {
  let proof_req4 = JSON.parse(JSON.stringify(PROOF_REQ));

  let start_date = $("#mem-start-date").is(":checked");
  let mem_type = $("#mem-type").is(":checked");
  let mem_group = $("#mem-group").is(":checked");
  if (!start_date && !mem_type && !mem_group) {
    alert("Select attributes.");
    return;
  }
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

  create_request_qrcode(proof_req4);
});

function subtractYears(date, years) {
  date.setFullYear(date.getFullYear() - years);

  return Math.floor(date.getTime() / 1000);
}
